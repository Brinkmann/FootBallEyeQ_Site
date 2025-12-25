/**
 * Exercise JSON Converter
 * 
 * This script converts your existing exercise JSON format to the new clean schema.
 * 
 * OLD FORMAT:
 * {
 *   "ID": "001",
 *   "Age Group": "General / Unspecified",
 *   "Decision Theme": "Pass or Dribble",
 *   "Description": "...",
 *   "Difficulty": "General / Unspecified",
 *   "Duration": "15-20 mins",
 *   "Game Moment": "Build-Up",
 *   "Image": "",
 *   "Overview": "...",
 *   "Player Involvement": "Team Unit (5+ players)",
 *   "Tags": "General / Unspecified, Pass or Dribble, ...",
 *   "Title": "Pass to the Cone Matching the Pass-From Colour"
 * }
 * 
 * NEW FORMAT (for Firebase):
 * {
 *   "id": "001",
 *   "title": "Pass to the Cone Matching the Pass-From Colour",
 *   "ageGroup": "General / Unspecified",
 *   "decisionTheme": "Pass or Dribble",
 *   "playerInvolvement": "Team Unit (5+ players)",
 *   "gameMoment": "Build-Up",
 *   "difficulty": "General / Unspecified",
 *   "practiceFormat": "Warm-Up / Ball Mastery",
 *   "overview": "...",
 *   "description": "...",
 *   "image": ""
 * }
 * 
 * USAGE:
 * 1. Save your old exercises JSON as 'old-exercises.json' in this scripts folder
 * 2. Run: node scripts/convert-exercises.js
 * 3. Output will be saved as 'new-exercises.json'
 */

const fs = require('fs');
const path = require('path');

// Practice format mapping - extracts from the old Tags field
const PRACTICE_FORMATS = [
  "Warm-Up / Ball Mastery",
  "Fun Game / Physical",
  "Finishing / Shooting Pattern",
  "Positional Possession Game",
  "Rondo / Tight Possession",
  "Directional Small-Sided Game",
  "General / Mixed"
];

function extractPracticeFormat(tagsString) {
  if (!tagsString) return "General / Mixed";
  
  const tags = tagsString.split(',').map(t => t.trim());
  
  // Find the first tag that matches a practice format
  for (const tag of tags) {
    for (const format of PRACTICE_FORMATS) {
      if (tag.toLowerCase() === format.toLowerCase() || 
          tag.toLowerCase().includes(format.split('/')[0].trim().toLowerCase())) {
        return format;
      }
    }
  }
  
  return "General / Mixed";
}

function cleanDescription(description) {
  if (!description) return "";
  
  // Remove the tag headers from the description
  const linesToRemove = [
    /^Exercise ID \d+\s*[–-]\s*.*/gm,
    /^Age Group Tag:.*$/gm,
    /^Decision Theme Tag:.*$/gm,
    /^Player Involvement Tag:.*$/gm,
    /^Game Moment Tag:.*$/gm,
    /^Difficulty Level Tag:.*$/gm,
    /^Practice Format Tag:.*$/gm,
  ];
  
  let cleaned = description;
  for (const pattern of linesToRemove) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Remove excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
}

function convertExercise(oldExercise) {
  return {
    id: oldExercise["ID"] || oldExercise.id || "",
    title: oldExercise["Title"] || oldExercise.title || "",
    ageGroup: oldExercise["Age Group"] || oldExercise.ageGroup || "General / Unspecified",
    decisionTheme: oldExercise["Decision Theme"] || oldExercise.decisionTheme || "General / Unspecified",
    playerInvolvement: oldExercise["Player Involvement"] || oldExercise.playerInvolvement || "General / Unspecified",
    gameMoment: oldExercise["Game Moment"] || oldExercise.gameMoment || "General / Unspecified",
    difficulty: oldExercise["Difficulty"] || oldExercise.difficulty || "General / Unspecified",
    practiceFormat: extractPracticeFormat(oldExercise["Tags"] || oldExercise.tags),
    overview: oldExercise["Overview"] || oldExercise.overview || "",
    description: cleanDescription(oldExercise["Description"] || oldExercise.description || ""),
    image: oldExercise["Image"] || oldExercise.image || ""
  };
}

function convertExercises(oldExercises) {
  return oldExercises.map(convertExercise);
}

// Main execution
const inputFile = path.join(__dirname, 'old-exercises.json');
const outputFile = path.join(__dirname, 'new-exercises.json');

if (fs.existsSync(inputFile)) {
  try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const oldExercises = JSON.parse(rawData);
    
    const newExercises = convertExercises(Array.isArray(oldExercises) ? oldExercises : [oldExercises]);
    
    fs.writeFileSync(outputFile, JSON.stringify(newExercises, null, 2), 'utf8');
    
    console.log(`Converted ${newExercises.length} exercises successfully!`);
    console.log(`Output saved to: ${outputFile}`);
    console.log('\nSample converted exercise:');
    console.log(JSON.stringify(newExercises[0], null, 2));
  } catch (error) {
    console.error('Error converting exercises:', error.message);
  }
} else {
  console.log('No input file found. Creating a sample template...');
  
  const sampleOld = [
    {
      "ID": "001",
      "Age Group": "General / Unspecified",
      "Decision Theme": "Pass or Dribble",
      "Description": "Exercise ID 01 – Pass to the Cone Matching the Pass-From Colour\nAge Group Tag: General / Unspecified\nDecision Theme Tag: Pass or Dribble\nPlayer Involvement Tag: Team Unit (5+ players)\nGame Moment Tag: Build-Up\nDifficulty Level Tag: General / Unspecified\nPractice Format Tag: Warm-Up / Ball Mastery\n\n### Overview\n- A passing drill with color cues\n\n### Setup\n- Four cones in a square\n\n### Description\n- Player scans and passes to matching color\n\n### Coaching Points\n- Keep head up\n- Quick scanning",
      "Difficulty": "General / Unspecified",
      "Duration": "15-20 mins",
      "Game Moment": "Build-Up",
      "Image": "",
      "Overview": "A passing and awareness drill with color cues.",
      "Player Involvement": "Team Unit (5+ players)",
      "Tags": "General / Unspecified, Pass or Dribble, Team Unit (5+ players), Build-Up, General / Unspecified, Warm-Up / Ball Mastery",
      "Title": "Pass to the Cone Matching the Pass-From Colour"
    }
  ];
  
  const sampleNew = convertExercises(sampleOld);
  
  console.log('\n=== OLD FORMAT (your current JSON) ===');
  console.log(JSON.stringify(sampleOld[0], null, 2));
  
  console.log('\n=== NEW FORMAT (for Firebase) ===');
  console.log(JSON.stringify(sampleNew[0], null, 2));
  
  console.log('\n=== INSTRUCTIONS ===');
  console.log('1. Save your exercises JSON as: scripts/old-exercises.json');
  console.log('2. Run: node scripts/convert-exercises.js');
  console.log('3. Upload new-exercises.json to Firebase');
}
