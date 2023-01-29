const { isValidObjectId } = require('mongoose');
const CourseModel = require('../model/CourseModel');

const { isTitle, isDescription, isVideoUrl, isTopics} = require('../validator');

exports.createCourse = async function(req,res){
    try {
        const data = req.body;
        const topic = data.topics;
        Object.keys(data).forEach(x => data[x] = data[x].toString().trim());
        let arr = ["title", "description", "videoUrl", "duration", "category"];
        for (let i = 0; i < arr.length; i++) {
            if (!data[arr[i]]) return res.status(400).send({ status: false, message: `${arr[i]} is required.` });
        }

        if(!isTitle(data.title)) return res.status(400).send({ status: false, message: "Invalid title."});

        if(!isDescription(data.description)) return res.status(400).send({ status: false, message: "Invalid description."});

        let videoUrl = await isVideoUrl(data.videoUrl);
        if (!videoUrl) return res.status(400).send({ status: false, message: "Please provide valid videoUrl" });

        const topics = isTopics(topic);
        if(topics=="Empty") return res.status(400).send({ status: false, message: "topics can't be empty."});
        if (!topics) return res.status(400).send({ status: false, message: "Please provide valid topics." });
        data.topics = topic;

        if(isNaN(data.duration)) return res.status(400).send({ status: false, message: "Duration must be numeric."});

        if(!isTitle(data.category)) return res.status(400).send({ status: false, message: "Invalid category."});

        const course = await CourseModel.create(data);

        res.status(201).send({ status: true, message: "Course created successfully.", data: course});

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

exports.approveCourse = async function(req,res){
    try {
        if(req.decoded.role != "Super admin") return res.status(403).send({ status: false, message: "Only Super admins can approve."});
        const courseId = req.params.courseId;
        if(!isValidObjectId(courseId)) return res.status(400).send({status: false, message: "Please provide valid objectId."});
        const course = await CourseModel.findOneAndUpdate(
            {_id: courseId, isDeleted: false, isApproved: false},
            {isApproved: true, approvedBy: req.decoded.id, approvedAt: Date.now()}
        )

        if(!course) return res.status(404).send({status: false, message: "Course not found."});
        return res.status(200).send({status: false, message: "Course updated successfully."});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

exports.updateCourse = async function(req,res){
    try {
        if(req.decoded.role != "Admin") return res.status(403).send({ status: false, message: "Only Admins can update."});
        const courseId = req.params.courseId;
        if(!isValidObjectId(courseId)) return res.status(400).send({status: false, message: "Please provide valid objectId."});
        const data = req.body;
        Object.keys(data).forEach(x => data[x] = data[x].toString().trim());
        let arr = ["videoUrl", "duration"];
        for (let i = 0; i < arr.length; i++) {
            if (!data[arr[i]]) return res.status(400).send({ status: false, message: `${arr[i]} is required.` });
        }
        const topics = isTopics(data.topics)
        if(topics=="Empty") return res.status(400).send({ status: false, message: "topics can't be empty."});
        if (!topics) return res.status(400).send({ status: false, message: "Please provide valid topics." });

        const course = await CourseModel.findOneAndUpdate(
            {_id: courseId, isDeleted: false},
            {...data, isApproved: false},
            {new: true}
        );

        if(!course) return res.status(404).send({status: false, message: "Course not found."});
        res.status(200).send({status: true, message: "Updated successfully.", data: course});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

exports.deleteCourse = async function(req,res){
    try {
        if(req.decoded.role != "Admin") return res.status(403).send({ status: false, message: "Only Admins can delete."});
        const courseId = req.params.courseId;
        if(!isValidObjectId(courseId)) return res.status(400).send({status: false, message: "Please provide valid objectId."});
        const course = await CourseModel.findOneAndUpdate(
            {_id: courseId, isDeleted: false},
            {isDeleted: true}
        );
        if(!course) return res.status(404).send({status: false, message: "Course not found."});
        res.status(200).send({status: true, message: "Deleted successfully."});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

exports.getCourse = async function(req,res){
    try {
        const courseId = req.params.courseId;
        if(!isValidObjectId(courseId)) return res.status(400).send({status: false, message: "Please provide valid objectId."});
        const course = await CourseModel.findOne({_id: courseId, isDeleted: false});
        if(!course) return res.status(404).send({status: false, message: "Course not found."});
        res.status(200).send({status: true, data: course});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}