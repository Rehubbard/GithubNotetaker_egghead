var React = require('react');
var Router = require('react-router');
var Repos = require('./Github/Repos');
var UserProfile = require('./Github/UserProfile');
var Notes = require('./Notes/Notes');
var ReactFireMixin = require('reactfire');
var firebase = require('firebase');
var helpers = require('../utils/helpers');


var Profile = React.createClass({
    
    mixins: [ReactFireMixin],
        
    getInitialState: function(){
        return {
            notes: [],
            bio: {},
            repos: []
        } 
    }, 
    
    componentDidMount: function(){
        //new firebase requires a config object to be set up
        var config = {
            apiKey: "AIzaSyDJwxHcbogNOrr8Jcz5AwrFy_pSUssvvB0",
            authDomain: "github-note-taker-cb.firebaseapp.com",
            databaseURL: "https://github-note-taker-cb.firebaseio.com",
            storageBucket: "github-note-taker-cb.appspot.com",
        };
        firebase.initializeApp(config);
        this.ref = firebase.database().ref('Users');
        this.init(this.props.params.username);
        
    },
    
    componentWillReceiveProps: function(nextProps){
      this.unbind('notes');
      this.init(nextProps.params.username);
    },
    
    init: function(username){
        var childRef = this.ref.child(username);
        this.bindAsArray(childRef, 'notes');
        
        helpers.getGithubInfo(username).then(function(data){
            this.setState({
                bio: data.bio,
                repos: data.repos
            })
        }.bind(this));
        
    },
    
    componentWillUnmount: function(){
        this.unbind('note');
    },
    
    handleAddNote: function(newNote){
        //update Firebase with the new note
        var link = firebase.database().ref('Users');
        var user = link.child(this.props.params.username);
        var endNotes = user.child(this.state.notes.length);
        console.log(endNotes);
        endNotes.set(newNote);
    },
    
    render: function(){
        
        return (
        <div className="row">
            <div className="col-md-4">
                <UserProfile username={this.props.params.username} bio={this.state.bio} />
            </div>
            <div className="col-md-4">
                <Repos username={this.props.params.username} repos={this.state.repos} />
            </div>
            <div className="col-md-4">
                <Notes 
                    username={this.props.params.username} 
                    notes={this.state.notes}
                    addNote={this.handleAddNote} />
            </div>
        </div>
        
        )
    }

});

module.exports = Profile;
