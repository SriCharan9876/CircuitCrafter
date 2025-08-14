import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'symbol',               // .asy
      'model',                // .sub, .lib, .301, .cir
      'hierarchicalSchematic' // .asc for hierarchical symbols
    ],
    required: true
  },
  downloadUrl: {
    type: String,
    required: true
  },
  public_id:{
    type:String,
    required:true
  },
  savePath: {
    type: String,
    required: true
  }
}, { _id: false });

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  files: [fileSchema],
  approved:{
    type:Boolean,
    default:false
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
}, { timestamps: true });

const Component = mongoose.model('Component', componentSchema);
export default Component;