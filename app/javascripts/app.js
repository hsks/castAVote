window.App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('./app/candidates.json', function(data) {
      var candidatesSection = $('#candidates');
      var candidatesRow = $('#candidate_row');

      for (i = 0; i < data.length; i ++) {
        candidatesRow.find('.name').text(data[i].name);
        candidatesRow.find('.id').text(data[i].id);
        candidatesRow.find('#candidateId').attr('id', data[i].id);
        candidatesSection.append(candidatesRow.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
  // If no injected web3 instance is detected, fall back to Ganache
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
}
web3 = new Web3(App.web3Provider);
},

voteForCandidate: function() {
  web3.eth.getAccounts(function(error, accounts) {
    if(error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Adoption.deployed().then(function(instance) {
      votersInstance = instance;
      return votersInstance.voteForCandidate(1, {from: account});
    }).then(function(result) {
      console.log("voted for candidate");
    }).catch(function(error) {
      console.log("error voting for candidate");
    });

  });

},

// initContract: function() {
//   $.getJSON('Voters.json', function(data) {
//   // Get the necessary contract artifact file and instantiate it with truffle-contract
//   var VotersArtifact = data;
//   App.contracts.Voters = TruffleContract(VotersArtifact);

//   // Set the provider for our contract
//   App.contracts.Voters.setProvider(App.web3Provider);

//   // Use our contract to retrieve and mark the adopted pets
//   return App.markAdopted();
// });

//   return App.bindEvents();
// },

// bindEvents: function() {
//   $(document).on('click', '.btn-adopt', App.handleAdopt);
// },

// markAdopted: function(adopters, account) {
//   var adoptionInstance;

//   App.contracts.Adoption.deployed().then(function(instance) {
//     adoptionInstance = instance;

//     return adoptionInstance.getAdopters.call();
//   }).then(function(adopters) {
//     for (i = 0; i < adopters.length; i++) {
//       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
//         $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
//       }
//     }
//   }).catch(function(err) {
//     console.log(err.message);
//   });
// },

// handleAdopt: function(event) {
//   event.preventDefault();

//   var petId = parseInt($(event.target).data('id'));

//   var adoptionInstance;

//   web3.eth.getAccounts(function(error, accounts) {
//     if (error) {
//       console.log(error);
//     }

//     var account = accounts[0];

//     App.contracts.Adoption.deployed().then(function(instance) {
//       adoptionInstance = instance;

//     // Execute adopt as a transaction by sending account
//     return adoptionInstance.adopt(petId, {from: account});
//   }).then(function(result) {
//     return App.markAdopted();
//   }).catch(function(err) {
//     console.log(err.message);
//   });
// });
// }

};

$(function() {
  $(document).ready(function() {
    App.init();
  });
});
