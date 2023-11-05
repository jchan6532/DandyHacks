// This code is for v4 of the openai package: npmjs.com/package/openai
const OpenAI = require('openai');
const mongoose = require('mongoose');

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateQuiz(username) {

    mongoose.connect('mongodb://localhost:27017/dandyhacks', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log("Connected to the database");
    });

    let User;
    if (mongoose.models.User) {
        User = mongoose.model('User');
    }
    else {
        User = mongoose.model('User', new mongoose.Schema({ 
            _id: String,
            id: Number,
            username: String,
            password: String,
            name: String,
            age: Number,
            userPastPerformance: Object
        }));
    }
   
    const user = await User.findOne({ "username": username });
    console.log("usr found");
    if (!user) {
        throw new Error('User not found');
    }

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "Role: Intelligent Quiz Creator\n\nDescription:\nYou are an AI-based Intelligent Quiz Creator tasked with generating tailored quiz questions based on student profiles. Your goal is to provide questions for subtopics within a main topic (e.g., \"Math\"). You will be provided with JSON-formatted student profiles that contain information about their past performance on specific subtopics.\n\nYou will receive JSON-formatted input data with the following structure:\n{\n  \"main_topic\": \"Math\",\n  \"subtopics\": [\n    {\n      \"name\": \"Addition\",\n      \"performance\": 0.3\n    },\n    {\n      \"name\": \"Subtraction\",\n      \"performance\": 0.6\n    },\n    {\n      \"name\": \"Multiplication\",\n      \"performance\": 0.8\n    }\n  ]\n}\n    main_topic: The main topic (e.g., \"Math\").\n    subtopics: An array of subtopics, each containing a name and a performance value between 0 (terrible) and 1 (mastery) that rates the student's performance in that subtopic.\n\nOutput Format:\n\n    You should provide quiz questions in JSON format with the following structure:\n[\n  {\n    \"question\": \"question\",\n    \"multiple_choice_answers\": [\"a\", \"b\", \"c\", \"d\"],\n    \"correct_answer\": \"correct answer\"\n  } question: The quiz question to be presented to the student.\n    multiple_choice_answers: An array of multiple-choice answer options.\n    correct_answer: The correct answer among the multiple-choice options.\n\nGuidelines:\n\n    Generate quiz questions that are relevant to the subtopics with lower performance ratings. Questions should be appropriately challenging but not overly difficult. Also make sure that your token limit does not reach 400\n    Ensure that the questions cover a range of difficulty levels to help students improve their weaknesses in the subtopics.\n   Strive for a balanced mix of question types (e.g., arithmetic, algebra) within the given subtopics.\n\nAdditional Information:\n\n    You have access to a vast knowledge base to generate questions, and you can leverage your understanding of mathematics to create meaningful and educational quizzes.\n\nImportant:\n\n    Please provide questions that are suitable for the indicated subtopics and take into consideration the students' performance levels. The goal is to help them improve and strengthen their understanding of these topics. Provide only a max of 5 questions.\n"
          },
          {
            "role": "user",
            "content": JSON.stringify(user.userPastPerformance)
          },
          {
            "role": "assistant",
            "content": "[\n  {\n    \"question\": \"question\",\n    \"multiple_choice_answers\": [\n      \"a\",\n      \"b\",\n      \"c\",\n      \"d\"\n    ],\n    \"correct_answer\": \"correct answer\"\n  }]"
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    console.log(response);
    const jsonresponse = response.choices[0].message;
    console.log(jsonresponse);
    return jsonresponse
}

module.exports = generateQuiz;
