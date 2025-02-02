const express = require('express');
const Group = require('../schema/Group');
const { body, validationResult } = require('express-validator');
const router = express.Router();


router.post('/createGroup/:id', [
    body('MainGroupName').notEmpty().withMessage('Please Enter Your Group Name'),
    body('Peoples').notEmpty().withMessage('Number Of People in Number required'),
    body('phoneNumber').notEmpty().withMessage('Enter people number required')
  ], async (req, res) => {
    let Success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Success, errors: errors.array() });
    }
  
    let totalcost = 0;
    const { id } = req.params;
  
    try {
      // Create the group in the database
      let Groupdetail = await Group.create({
        userId: id,
        MainGroupName: req.body.MainGroupName,
        Peoples: req.body.Peoples,
        phoneNumber: req.body.phoneNumber,
        totalinvest: totalcost,
      });
  
      // Get the group ID after the group is created
      const groupId = Groupdetail._id;
  
      Success = true;
      res.json({
        Success,
        groupId: groupId,  
        groupDetails: Groupdetail
      });
  
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ Success, message: "Error creating group" });
    }
  });
  

router.put('/updateGroup/:id',async(req,res)=>{
    try {
      let Success = false;
      const { MainGroupName,Peoples,phoneNumber } = req.body;
      const Groupid = await Group.findById(req.params.id);
      if (!Groupid) {
          return res.status(404).json("Group Is not found");
      }
      let NewGroup = {};
      if (MainGroupName){ NewGroup.MainGroupName = MainGroupName};
      if (Peoples){ NewGroup.Peoples = Peoples};
      if (phoneNumber){ NewGroup.phoneNumber = phoneNumber};
      const updatedGroup = await Group.findByIdAndUpdate(req.params.id, { $set: NewGroup }, { new: true });
      Success = true;
      res.json({Success,updatedGroup});
  } catch (error) {
      console.error("Error updating post:", error.message);
      res.status(500).send("There is an error in the update post API");
  }
  })


  router.get('/GetAllGroups/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the groups and populate the userId field with 'name' and 'email'
        const Groups = await Group.find({ userId: id })
            .populate('userId', 'name email');

        if (!Groups || Groups.length === 0) {
            return res.status(404).json({ error: 'No groups found for this user.' });
        }

        // Add the groupId to each group in the result
        const groupsWithId = Groups.map(group => ({
            groupId: group._id,  // Add the groupId explicitly
            ...group.toObject()   // Convert mongoose document to plain JS object
        }));

        res.status(200).json(groupsWithId);
    } catch (error) {
        console.error("Error in Get-All-Groups System:", error);
        res.status(500).json({ message: 'Internal Server Error in Get-All-Groups System' });
    }
});


router.get('/AllGroups', async (req, res) => {
    try {
      const groups = await Group.find()
        .populate('userId', 'name email')
        .sort({ totalinvest: -1 }); // Sort by totalinvest in descending order
  
      if (!groups || groups.length === 0) {
        return res.status(404).json({ error: 'No groups found.' });
      }
  
      res.status(200).json(groups);
    } catch (error) {
      console.error("Error in Get-All-Groups System:", error);
      res.status(500).json({ message: 'Internal Server Error in Get-All-Groups System' });
    }
  });
  

router.delete("/DeleteGroup/:id", async (req, res) => {
    try {
        let Groups = await Group.findById(req.params.id);
        if (!Groups) {
            return res.status(404).json("Group is not found");
        }
        const DeletePost = await Group.findByIdAndDelete(req.params.id);
        Success = true;
        res.json({Success,DeletePost});
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("There is an error in the update post API");
    }
});

module.exports = router;