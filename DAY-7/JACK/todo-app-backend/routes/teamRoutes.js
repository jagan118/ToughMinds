const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const authMiddleware = require('../middlewear/authMiddlewear');

// ========== CREATE TEAM ==========
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    // Create team with current user as owner
    const team = new Team({
      name,
      description,
      owner: req.user._id
    });

    await team.save();

    // Add owner as team member
    const teamMember = new TeamMember({
      teamId: team._id,
      userId: req.user._id,
      role: 'owner'
    });

    await teamMember.save();

    res.status(201).json({
      message: 'Team created successfully',
      team,
      owner: req.user.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== GET ALL TEAMS FOR CURRENT USER ==========
router.get('/my-teams', authMiddleware, async (req, res) => {
  try {
    // Find all teams where current user is a member
    const teamMembers = await TeamMember.find({ userId: req.user._id })
      .populate({
        path: 'teamId',
        select: 'name description owner createdAt'
      });

    // Extract team data
    const teams = teamMembers.map(tm => ({
      ...tm.teamId.toObject(),
      role: tm.role,
      isOwner: tm.role === 'owner',
      ownerId: tm.teamId.owner,
      joinedAt: tm.joinedAt
    }));

    res.json({
      message: 'Teams fetched',
      teams,
      count: teams.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== GET TEAM DETAILS + MEMBERS ==========
router.get('/:teamId', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Check if user is a member of this team
    const membership = await TeamMember.findOne({
      teamId,
      userId: req.user._id
    });

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    // Get team details
    const team = await Team.findById(teamId).populate('owner', 'name email');

    // Get all members of this team
    const members = await TeamMember.find({ teamId })
      .populate('userId', 'name email');

    res.json({
      team,
      members: members.map(m => ({
        name: m.userId.name,
        email: m.userId.email,
        role: m.role,
        joinedAt: m.joinedAt,
        userId: m.userId._id
      })),
      yourRole: membership.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== INVITE MEMBER BY EMAIL ==========
router.post('/:teamId/invite', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body;

    // Check if current user is owner
    const membership = await TeamMember.findOne({
      teamId,
      userId: req.user._id
    });

    if (!membership || membership.role !== 'owner') {
      return res.status(403).json({ error: 'Only team owner can invite members' });
    }

    // Find user by email
    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    // Check if already a member
    const alreadyMember = await TeamMember.findOne({
      teamId,
      userId: userToInvite._id
    });

    if (alreadyMember) {
      return res.status(400).json({ error: 'User is already a member of this team' });
    }

    // Add user to team as member
    const newMember = new TeamMember({
      teamId,
      userId: userToInvite._id,
      role: 'member'
    });

    await newMember.save();

    res.json({
      message: `${userToInvite.name} added to team successfully`,
      member: {
        name: userToInvite.name,
        email: userToInvite.email,
        role: 'member',
        joinedAt: newMember.joinedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== REMOVE MEMBER FROM TEAM ==========
router.delete('/:teamId/members/:userId', authMiddleware, async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    // Check if current user is owner
    const ownership = await TeamMember.findOne({
      teamId,
      userId: req.user._id
    });

    if (!ownership || ownership.role !== 'owner') {
      return res.status(403).json({ error: 'Only owner can remove members' });
    }

    // Remove the member
    await TeamMember.findOneAndDelete({
      teamId,
      userId
    });

    res.json({ message: 'Member removed from team' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== DELETE TEAM (OWNER ONLY) ==========
router.delete('/:teamId', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Check if current user is owner
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can delete team' });
    }

    // Delete team and all memberships
    await Team.findByIdAndDelete(teamId);
    await TeamMember.deleteMany({ teamId });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;