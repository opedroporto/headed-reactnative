//db.js
import { MongoClient } from 'mongodb'

MongoClient.connect('mongodb://localhost:27017', 
                        {useUnifiedTopology: true},
                        (error, connection) => {
                            if (error) return console.log(error);
                            global.connection = connection.db('app');
                            console.log('Database connected')
                        });
                        
export default MongoClient