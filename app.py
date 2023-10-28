from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
from PyPDF2 import PdfReader


app = Flask(__name__)
CORS(app)


openai.api_key = "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"  # Replace with your OpenAI API key

@app.route("/textGeneration", methods=["POST"])
def generateText():
    try:
        data = request.get_json()
        chat = data.get("chat")
        print(chat)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat
        )
        gpt_choice = response.choices[0]
        print(gpt_choice)
        return jsonify({'gpt_choice': gpt_choice}), 200  # Status code 200 for success
    except Exception as error:
        print('Error in /textGeneration route:', error)
        return jsonify({'error': 'An error occurred while processing the request.'}), 500  # Status code 500 for internal server error



def extract_text_from_pdf(pdfFile):
    try:
        pdf_reader = PdfReader(pdfFile)

        text = ''

        for page in pdf_reader.pages:
            text += page.extract_text()

        return text

    except Exception as e:
        return str(e)


@app.route('/summarization', methods=['POST'])
def generateSummary():

    pdffile = request.files['pdfFile']
    pdftext = extract_text_from_pdf(pdffile)

    prompt = f"Summarize the following text:\n\n{pdftext}\n\n .For summarize use advanced NLP techniques to maintain context and relevance."
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}],
        max_tokens=150,
    )

    return response


@app.route('/analyze', methods=['POST'])
def analyze_sentiment_and_emotion():
    try:
        data = request.get_json()
        text = data.get('text')

        messages = [
            {"role": "system", "content": "You are an emotion and sentiment recognition assistant."},
            {"role": "user", "content": f'Analyze the text and give me only one word response for this: "{text}"'}
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        result = response.choices[0].message.content

        return jsonify({'result': result})
    except Exception as error:
        print('Error in /analyze route:', error)
        return jsonify({'error': 'An error occurred while processing the request.'}), 500


if __name__ == "__main__":
    app.run(debug=True)
