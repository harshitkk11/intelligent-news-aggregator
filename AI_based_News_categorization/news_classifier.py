from transformers import pipeline

# Load pre-trained BERT model for text classification
classifier = pipeline("text-classification", model="nlptown/bert-base-multilingual-uncased-sentiment")

# Example news article
news_text = "i got internship."

# Get category
result = classifier(news_text)
print(result)
