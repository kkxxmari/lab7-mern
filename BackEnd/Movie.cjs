// Use the same Mongoose instance as the connection module.
// That keeps the Movie model attached to the database opened at startup.
const { mongoose } = require('./database.cjs');

// Give each movie a small, tidy shape before we put it in the collection.
// These names match the fields that our form sends to the API.
const fields = {
  // Trim outside spaces and require a title short enough for our form.
  // Empty or oversized values will become validation errors when saved.
  title: { type: String, required: true, trim: true, maxLength: 200 },
  // Years are stored as text because the form sends a text value.
  // A custom check below makes sure it still looks like a sensible year.
  year: {
    type: String,
    required: true,
    trim: true,
    // Keep the release year as four digits, just like the form expects.
    // This check still runs if someone skips the browser and calls the API.
    validate: { validator: year => /^\d{4}$/.test(year) && Number(year) >= 1888 }
  },
  // Keep the poster URL beside the title and year in the same document.
  // The card can use that address later without another database lookup.
  poster: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2048,
    // We only need the picture's web address, not an uploaded image file.
    // A complete HTTP or HTTPS link is a good fit for the poster field.
    validate: { validator: poster => /^https?:\/\//i.test(poster) && URL.canParse(poster) }
  }
};

// Leave buffering off so a disconnected database does not hide a problem.
// MongoDB will provide a unique _id for every lovely little movie record.
// versionKey=false omits the internal __v field from these simple documents.
// We still keep the normal _id field that identifies each saved movie.
const schema = new mongoose.Schema(fields, { versionKey: false, bufferCommands: false });
// The model gives our routes their save, find and findById operations.
// Its default collection name in MongoDB is movies.
module.exports = mongoose.model('Movie', schema);
