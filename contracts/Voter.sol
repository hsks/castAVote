pragma solidity ^0.4.19;

contract Voter {
	mapping(address => uint) voterVsCandidate;
	mapping(uint => string) idVsName;
	mapping(uint => uint) votesVsCandidate;
	uint numberOfCandidate=0;
	uint totalVotesCast = 0;
	
	event test_numberOfCandidate(uint value1);
	event test_name(string name);

	function getCandidateName(uint candidateId) public returns(string) {
	    test_name(idVsName[candidateId]);
		return idVsName[candidateId];
	}

	function voteForCandidate(uint candidateId) public{
	    votesVsCandidate[candidateId] += 1;
		voterVsCandidate[msg.sender] = candidateId;
		totalVotesCast += 1;
	}

	function addCandidate(string candidateName) public{
		numberOfCandidate+=1;
		idVsName[numberOfCandidate] = candidateName;
	}

	function getNumberOfCandidates() public returns(uint) {
	    test_numberOfCandidate(numberOfCandidate);
		return 1;
	}
	
	function getVotesForCandidate(uint id) returns(uint) {
	    return votesVsCandidate[id];
	}

	function getTotalVotesCast() constant returns(uint) {
		return totalVotesCast;
	}
}
