const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

// Indexes for efficient querying
taskSchema.index({ user: 1, status: 1 });

taskSchema.pre('save', function(next) {
  console.log(`Saving task: ${this.name}`);
  next();
});

taskSchema.post('save', function(doc) {
  console.log(`Task saved: ${doc.name}`);
});

taskSchema.post('remove', function(doc) {
  console.log(`Task removed: ${doc.name}`);
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;