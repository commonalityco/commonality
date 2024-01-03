const readme = `# Xornet Ipsum

Xornet ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.

## Installation

Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.

<a href="/hello">This is a link</a>

\`\`\`bash
npm install xornet-ipsum
\`\`\`

## Usage

Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.

\`\`\`javascript
const xornetIpsum = require('xornet-ipsum');

// Generate 5 paragraphs with default options
const paragraphs = xornetIpsum.generate(5);
console.log(paragraphs);
\`\`\`

## Configuration

Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.

| Option          | Type    | Default | Description                               |
|-----------------|---------|---------|-------------------------------------------|
| \`paragraphs\`    | Integer | 5       | Number of paragraphs to generate          |
| \`sentences\`     | Integer | 4       | Number of sentences per paragraph         |
| \`words\`         | Integer | 8       | Number of words per sentence              |
| \`includeHeader\` | Boolean | false   | Include header text in the output         |

### Example

In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.

\`\`\`javascript
const xornetIpsum = require('xornet-ipsum');
// This is a reaaaaaaaaaaaaaaaaaaaaaallllllllllllllllllllyyyyyyyyyyyyyy loonnggggggggggggggggggg lineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
const options = {
  paragraphs: 7,
  sentences: 6,
  words: 12,
  includeHeader: true 
};

const text = xornetIpsum.generate(options);
console.log(text);
\`\`\`

## Contributing

Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/new-feature\`)
3. Commit your changes (\`git commit -am 'Add some feature'\`)
4. Push to the branch (\`git push origin feature/new-feature\`)
5. Create a new Pull Request

## License

Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.`;

export default readme;
