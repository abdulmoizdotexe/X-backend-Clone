const Notification = require('../models/notification.model.js');

async function getAllNotifications(req, res){
    try {
        const userID = req.user._id;

        const notifications = await Notification.find({to: userID}).populate({path: "from", select: "username profileImgURL"});
        await Notification.updateMany({to: userID}, {read:true});
        return res.status(200).json({notifications});
    } catch (error) {
        console.log("Error in get all notifications");
        return res.status(500).json({error: error.message});
    }
}

async function deleteNotifications(req, res){
    try {
        const userID = req.user._id;

        await Notification.deleteMany({to: userID});

        return res.status(200).json({message: "Notifications deleted Successfully"});
    } catch (error) {
        console.log("Error in delete notifications");
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    getAllNotifications,
    deleteNotifications,
}