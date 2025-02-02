const express = require('express');
const Item = require('../schema/items');
const Group = require('../schema/Group');
const userr = require('../schema/user');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/createItem/:id', [
    body('itemname').notEmpty().withMessage('Please Enter Your Item Name'),
    body('itemCost').notEmpty().withMessage('Item cost in number required')
], async (req, res) => {
    let Success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Success, errors: errors.array() });
    }

    const { id } = req.params; 
    let { itemname, itemCost } = req.body;

    itemCost = parseFloat(itemCost);
    if (isNaN(itemCost)) {
      return res.status(400).json({
        Success,
        message: 'Invalid item cost. Please provide a valid number.',
      });
    }

    try {
      
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ Success, message: 'Group not found' });
        }

        const { Peoples, phoneNumber ,totalinvest } = group;

        const user = await userr.findById(group.userId);
        if (!user) {
            return res.status(404).json({ Success, message: 'User not found' });
        }

        const { name, email } = user;
        console.log(name, email);

        

        const costPerPerson = (itemCost / Peoples).toFixed(2); 

        const itemDetail = await Item.create({
            GroupName: id,
            itemname,
            itemCost,
        });

        const savedItem = await itemDetail.save();
        const currentInvestment = totalinvest || 0;
        const updatedInvestment = currentInvestment + itemCost;
        group.totalinvest = updatedInvestment;
        await group.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });
        
        const sendEmail = async (email, subject, message) => {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER, 
                    to: email,
                    subject: subject, 
                    text: message, 
                };
                const info = await transporter.sendMail(mailOptions);
            } catch (err) {
                console.error(`Failed to send email to ${email}:`, err.message);
            }
        };
        
        const emailSend = phoneNumber.map(async (email) => {
            const subject = `New Item Added: ${itemname}`;
            const message = `Hello! A new item "${itemname}" costing ₹${itemCost} has been added to your group by ${name} (${email}).\n` +
                            `Each person owes ₹${costPerPerson}. Please make the payment at the earliest.`;
        
            await sendEmail(email, subject, message);
        });
        
        await Promise.all(emailSend);


        Success = true;
        res.json({ Success, savedItem, costPerPerson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Success, message: 'Internal Server Error' });
    }
});


router.put('/updateItem/:id',async(req,res)=>{
    try {
      let Success = false;
      const { itemname,itemCost} = req.body;
      const Itemid = await Item.findById(req.params.id);
      if (!Itemid) {
          return res.status(404).json("Item Is not found");
      }
      let NewEditItem = {};
      if (itemname){ NewEditItem.itemname = itemname};
      if (itemCost){ NewEditItem.itemCost = itemCost};
      const updatedItemPost = await Item.findByIdAndUpdate(req.params.id, { $set: NewEditItem }, { new: true });
      Success = true;
      res.json({Success,updatedItemPost});
  } catch (error) {
      console.error("Error updating post:", error.message);
      res.status(500).send("There is an error in the update post API");
  }
  })


  router.get('/GetAllItem/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const GroupsID = await Item.find({GroupName : id});
        if (!GroupsID || GroupsID.length === 0) {
            return res.status(404).json({ error: 'No answers found for this question.' });
          }
        res.status(200).json(GroupsID);
    } catch (error) {
        console.log(error, "this is the error");
     res.status(500).json("there is an error in Get-All-Answer Sysytem");
    }
})

router.delete("/DeleteItem/:id", async (req, res) => {
    try {
        let Itemss = await Item.findById(req.params.id);
        if (!Itemss) {
            return res.status(404).json("Group is not found");
        }
        const DeletePost = await Item.findByIdAndDelete(req.params.id);
        Success = true;
        res.json({Success,DeletePost});
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("There is an error in the update post API");
    }
});



module.exports = router;