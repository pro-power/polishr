const fs = require('fs');
const path = require('path');

try {
  const clientPath = path.join(__dirname, 'node_modules', '.prisma', 'client', 'index.d.ts');
  const content = fs.readFileSync(clientPath, 'utf8');
  
  // Look for User type
  const userTypeMatch = content.match(/export type User = \{[^}]+\}/s);
  if (userTypeMatch) {
    console.log('User type found:');
    console.log(userTypeMatch[0]);
    
    // Check for specific fields
    const hasOnboarding = content.includes('onboardingCompleted');
    const hasJobTitle = content.includes('jobTitle');
    const hasTemplateId = content.includes('templateId');
    
    console.log('\nField check:');
    console.log('onboardingCompleted:', hasOnboarding ? '✅' : '❌');
    console.log('jobTitle:', hasJobTitle ? '✅' : '❌');
    console.log('templateId:', hasTemplateId ? '✅' : '❌');
  } else {
    console.log('User type not found in generated client');
  }
} catch (error) {
  console.log('Error reading generated client:', error.message);
}
