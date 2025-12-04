// Clean Database Script - Deletes all test data

require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Get collections
    const Participant = mongoose.model('Participant', new mongoose.Schema({}, { strict: false }));
    const Trial = mongoose.model('Trial', new mongoose.Schema({}, { strict: false }));

    // Count before deletion
    const participantCount = await Participant.countDocuments();
    const trialCount = await Trial.countDocuments();

    console.log('\n📊 Current Database Stats:');
    console.log(`  Participants: ${participantCount}`);
    console.log(`  Trials: ${trialCount}`);

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete all data
    const participantResult = await Participant.deleteMany({});
    const trialResult = await Trial.deleteMany({});

    console.log('\n✅ Database Cleaned Successfully!');
    console.log(`  Deleted ${participantResult.deletedCount} participants`);
    console.log(`  Deleted ${trialResult.deletedCount} trials`);
    console.log('\n🎉 Your database is now ready for real participant data!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
