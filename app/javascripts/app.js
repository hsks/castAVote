import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
var VotersArtifact;
var account;
window.App = {
  web3Provider: null,
  contracts: {},
  init: function() {
    var self = this;
    $.getJSON('./build/contracts/Voter.json', function(result) {
      var votersContract = result;
      VotersArtifact = contract(votersContract);
      VotersArtifact.setProvider(web3.currentProvider);
      self.totalVotesCast();
    });
    // Load pets.
    $.getJSON('./app/candidates.json', function(data) {
      var candidatesSection = $('#candidates');
      var candidatesRow = $('#candidate_row');

      for (var i = 0; i < data.length; i++) {
        candidatesRow.find('.name').text(data[i].name);
        candidatesRow.find('.id').text(data[i].id);
        candidatesRow.find('.voteForCandidate').attr('id', data[i].id);
        candidatesRow.find(".getVotesForCandidate").attr('id', "votes"+data[i].id);
        candidatesRow.find(".voteCount").attr('id', "voteCount"+data[i].id);
        candidatesRow.find(".getVotesForCandidate").attr('data-candidateId', data[i].id);
        if(i<data.length-1) {
          candidatesSection.append(candidatesRow.html());
        }
      }
    });

    App.initWeb3();

  },

  fetchAccount: function() {
    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      account = accounts[0];
    });
  },

  initWeb3: function() {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
  // If no injected web3 instance is detected, fall back to Ganache
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
}
web3 = new Web3(App.web3Provider);
App.fetchAccount();
},

voteForCandidate: function(id) {
  var self=this;
  web3.eth.getAccounts(function(error, accounts) {
    if(error) {
      console.log(error);
    }

    var account = accounts[0];

    VotersArtifact.deployed().then(function(instance) {
      var votersInstance = instance;
      return votersInstance.voteForCandidate(id, {from: account});
    }).then(function(result) {
      self.totalVotesCast();
      console.log("voted for candidate");
    }).catch(function(error) {
      console.log("error voting for candidate");
    });

  });

},
getVotesForCandidateId: function(element) {
  var id = $(element).data('candidateid');
  VotersArtifact.deployed().then(function(instance) {
    var votersInstance = instance;
    return votersInstance.getVotesForCandidate(id);
  }).then(function(result) {
    $("#voteCount"+id).text(result.c[0]);
  }).catch(function(error) {
    console.log("error voting for candidate");
  });
},

totalVotesCast: function() {
  VotersArtifact.deployed().then(function(instance) {
    var votersInstance = instance;
    return votersInstance.getTotalVotesCast();
  }).then(function(result) {
    $("#totalVotes").text(result.c[0]);
  }).catch(function(error) {
    console.log("error voting for candidate");
  });
}

};

$(function() {
  $(document).ready(function() {
    App.init();
  });
});
