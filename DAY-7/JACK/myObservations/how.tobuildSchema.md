# step-1:
## Plan Your Data Structure means ex: how the user data should be stored in db like name ,email,pass,phn etc... and also decide data type sfor them like name to be string like that.

# step-2
* import mongoose : You are importing the Mongoose library. Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It acts as a bridge, allowing your Node.js code to talk to your MongoDB database using structured objects.
* ## Initialize the Schema Object
```
const postSchema = new mongoose.Schema({
    // Your fields will go here
});
```
* ## Define Fields and Add Validation
* fields  means like name,email like those and validation like name required validation ,unique validation like that 
* validations 1. type,2. required 3. unique, 4.default:

type: Specifies the data type (String, Number, Boolean, Date, Array, ObjectId).

required: Set to true if the field cannot be left blank. You can also pass a custom error message like [true, "Title is required"].

unique: Set to true to ensure no two documents in the database have the same value (perfect for emails or usernames).

default: Provides a fallback value if nothing is supplied.

trim: (For Strings) Automatically removes accidental spaces at the beginning or end of the text.

in schema object each filed will looks like
 title: {
        type: String,
        required: [true, 'A post must have a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },


   ## second arg for mongoose.schema 
   {
    timestamps: true // This automatically adds 'createdAt' and 'updatedAt' fields
}  
// This automatically adds 'createdAt' and 'updatedAt' fields

* Compile the Schema into a Model and Export It
A schema is just a configuration layout. To actually create, read, update, or delete data, you must turn that schema into a Model. Finally, export the model so your other backend files can use it.

// 'Post' becomes the name of the model. 
// Mongoose will automatically look for a collection named 'posts' in MongoDB.
const Post = mongoose.model('Post', postSchema);

module.exports = Post;