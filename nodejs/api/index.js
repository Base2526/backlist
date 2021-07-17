const socketsModel       = require('../models/sockets');
const usersModel         = require('../models/users');
const followerPostModel  = require('../models/follower_post');
const notificationsModel = require('../models/notifications')

const {empty, uid}            = require("../utils")

const notificationCenter = async(type, uid, item) =>{
    try{
  
      console.log("notificationCenter : ", type, uid, item)
      if( empty(type) || empty(uid) || item === null ){
        console.log("notificationCenter uid, item null : ", uid, item)
      }else{
  
        switch(type){
          case 1:{
            let notifications_model = await notificationsModel.findOne({ uid });
            item = {...item, uid, "date":new Date()}
            if ( notifications_model === null ){
              await new notificationsModel({ uid, notification: [item]}).save()
  
              await sendNotificationCenter(item.owner_id, item);
            }else {
              let notification = notifications_model.notification.toObject();
        
              if ( notification.length === 0 ){
                await notificationsModel.findOneAndUpdate(
                  { uid },
                  { $push: { notification: item } },
                  { new: true, upsert: true }
                );
  
                await sendNotificationCenter(item.owner_id, item);
              }else{
                let find_notification = notification.find(itm=>{return itm.type === item.type && itm.id === item.id})
                if ( find_notification  === undefined ){
                  await notificationsModel.findOneAndUpdate(
                    { uid },
                    { $push: { notification: item } },
                    { new: true, upsert: true }
                  );
      
                  await sendNotificationCenter(item.owner_id, item);
                }
              }
            }
  
            break
          }
  
          default:{
            break
          }
        }
      }
      return true
  
    }catch(error){
      console.log('notificationCenter, error : ', error);
  
      return false
    }
}

const sendNotificationCenter = async( uid, item)=>{
    try{
      console.log('sendNotificationCenter  : ', uid, item);
      let fss = await socketsModel.find({ uid });
      if ( fss !== null ){
        // case uid have muli devices
        fss.map((obj, i) => {
          if(obj.socketId){
            io.to(obj.socketId).emit('notification_center', JSON.stringify(item) );
          }
        })
      }
    }catch(error){
      console.log('sendNotificationCenter, error : ', error);
    }
}
  
const onFollowerPost = async(uid, item) =>{
    try {
      let { id, unique_id, owner_id, follow_up } = item
      if( empty(unique_id) ||  empty(owner_id)){    
        // return res.status(404).send({'message': 'ERROR'});
        console.log("onFollowerPost : !unique_id || !owner_id")
      }else{
        if(!follow_up){
          await followerPostModel.findOneAndUpdate( { post_id: id }, {$pull: {follower: uid}} );
        }else{
  
          let followerPost = await followerPostModel.findOne({ post_id: id });
          if ( followerPost === null ){
            await new followerPostModel({ post_id: id, follower: [uid]}).save()
  
            await noti_follower_post(uid, id, [uid])
          }else{
            followerPost = followerPost.toObject();
            let fi = followerPost.follower.find(e => String(e) === String(uid) );
            if(fi === undefined){
                await followerPostModel.findOneAndUpdate(
                    { post_id: id },
                    { $push: { follower: uid } },
                    { new: true, upsert: true }
                );

                let followerPost = await followerPostModel.findOne({ post_id });
                followerPost = followerPost.toObject();

                await noti_follower_post(uid, id, followerPost.follower)
            }
          }
        }
        return true;
      }
    } catch(err) {
      console.log(err);
  
      return false;
    }
}
  
const followUp = async (req, io) => {
  let {unique_id, datas} = req.body

  let json_datas = JSON.parse(datas);
  console.log('json_datas :', json_datas)

  if( empty(unique_id) || empty(json_datas) ){    
      return {result:false, message:"empty params {unique_id}, {json_datas} "}
  }

  let socket = await socketsModel.findOne({ uniqueId: unique_id });
  console.log("followUp , socket : ", socket)

  let uid = uid(unique_id)

  let user = await usersModel.findOne({ uid });
  json_datas.map( async item=>{
    let { owner_id } = item
    if( empty(owner_id)){    
      // return res.status(404).send({'message': 'ERROR'});
      console.log("___follow_up > !unique_id || !owner_id")
    }else{
      item.local = false // update all local = false
      if ( user === null ){
        await new usersModel({ uid, follow_ups: [item]}).save()
      }else{
        let find_user = await usersModel.findOne({ "follow_ups.id": item.id })
        // console.log('find_user : ', find_user)
        let noti = false
        if ( find_user === undefined || find_user === null ) {
          console.log("insert new")

          noti = true
          
          await usersModel.findOneAndUpdate(
                      { uid },
                      { $push: { follow_ups: item } },
                      { new: true, upsert: true }
                    );

        }else{
          find_user = find_user.toObject();
          // console.log("update : ", find_user.follow_ups)

          let fi = find_user.follow_ups.find(e => String(e.id) === String(item.id) );
          if(fi !== undefined){
            if(fi.date < item.date){
              await usersModel.updateOne({ uid, "follow_ups.id": item.id }, 
                              {'$set': 
                                {
                                  'follow_ups.$.date': item.date,
                                  'follow_ups.$.local': false,
                                  'follow_ups.$.status': item.status
                                }
                              }
                          )

              console.log("update new : ", item)

              noti = true                
            }
          }
        }

        if(noti){
          let fss = await socketsModel.find({ uid });
          if ( fss !== null ){

            user = await usersModel.findOne({ uid });
            user = user.toObject()
            fss.map((obj, i) => {
              console.log('obj.socketId : >>> ', obj, user.follow_ups)
              if(obj.socketId){
                io.to(obj.socketId).emit('___follow_up', JSON.stringify(user.follow_ups));
              }
            })
          }

          await onFollowerPost(uid, item);
          await notificationCenter(1, uid, item);

          console.log('noti : >>> if :  ', noti)
        }else{
          console.log('noti : >>> else :  ', noti)
        }
      }
    }
  })
  return {result:true, message:"ok"}  
}
 
module.exports = {
    followUp,
    // anotherMethod
};