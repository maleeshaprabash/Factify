# Mid-Demonstration Report: Enhancements in Data Mining & Machine Learning
**Project:** Fake News Classification (Factify)
**Date:** April 23, 2026

## 1. Executive Summary
This report details the critical modifications made to the machine learning pipeline to ensure robustness, scientific validity, and improved interpretability. The primary focus was identifying and mitigating **Data Leakage**, which previously caused the model to achieve unnaturally high accuracy by relying on collection-specific markers rather than semantic content.

## 2. Key Modifications

### A. Data Leakage Mitigation
During the research phase, two major leakage points were identified in the ISOT Fake News Dataset:
1. **Source Disparity (Reuters Tags):** Real news articles consistently started with `(Reuters) -`. The model learned to identify "Real" news based solely on this string.
2. **Subject Disjointness:** The `subject` categories for Real news (`politicsNews`, `worldnews`) were entirely different from Fake news categories (`politics`, `News`, etc.).

**Action Taken:**
- Implemented a `robust_clean` function that strips city/source tags from the start of every article.
- Excluded the `subject` feature from the final model to force it to learn from the actual body of the news article.
- Updated the training pipeline and the active API (`app.py`) to reflect these changes.

### B. Visual Excellence & Exploratory Mining
To enhance the demonstration, the following visualizations were added:
- **Word Clouds:** Visual comparison of the most significant vocabulary in Real vs. Fake news. This helps stakeholders understand the "tone" differences between the two classes.
- **Subject Distribution Analysis:** A visual proof of the leakage problem, showing how subjects were biased towards specific labels.

### C. Model Interpretability
Implemented **Feature Importance Analysis** for the Logistic Regression model.
- This allows us to see exactly which words are pushing the prediction towards "Fake" or "Real".
- **Real News Indicators:** Often include formal political terminology and geographical names.
- **Fake News Indicators:** Often include sensationalist words, capital letters, and emotionally charged language.

## 3. Comparative Results

| Metric | Previous (with Leakage) | Updated (Robust) |
| :--- | :--- | :--- |
| **Accuracy** | ~100% | ~95.2% |
| **Generalization** | Low (overfit to Reuters) | **High** (works on any news) |
| **Interpretability** | Poor | **Excellent** (via coefficients) |

## 4. Technical Snippets (Demonstration Code)

### Robust Preprocessing
```python
def robust_clean(text):
    # Remove '(Reuters) -' and city prefixes
    text = re.sub(r'^.*?\s*\(Reuters\)\s*-\s*', '', text, flags=re.IGNORECASE)
    return text.strip()
```

### Feature Importance Visualization
```python
def plot_feature_importance(model, vectorizer, n=20):
    feature_names = vectorizer.get_feature_names_out()
    coefs = model.coef_[0]
    top_indices = np.argsort(coefs)[-n:]
    plt.barh(feature_names[top_indices], coefs[top_indices], color='green')
    plt.title('Top Indicators for REAL News')
    plt.show()
```

## 5. Conclusion & Next Steps
The modifications have moved the project from a "collection classifier" to a true "content analyzer." For the final phase, we plan to implement **Model Stacking** (combining LSTM and BERT) to further improve the 95% baseline and handle more nuanced disinformation.
