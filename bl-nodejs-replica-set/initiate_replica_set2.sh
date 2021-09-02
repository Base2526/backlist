docker run  -d \
-p 30001:27017 \
--name mongo1 \
--net my-mongo-cluster \
mongo mongod --replSet my-mongo-set

docker run  -d \
-p 30002:27017 \
--name mongo2 \
--net my-mongo-cluster \
mongo mongod --replSet my-mongo-set

docker run  -d \
-p 30003:27017 \
--name mongo3 \
--net my-mongo-cluster \
mongo mongod --replSet my-mongo-set

rs.initiate(
  {
    _id : 'my-mongo-set',
    members: [
      { _id : 0, host : "mongo1:27017" },
      { _id : 1, host : "mongo2:27017" },
      { _id : 2, host : "mongo3:27017" }
    ]
  }
)