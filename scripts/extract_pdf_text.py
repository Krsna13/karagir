from pdfminer.high_level import extract_text
pdf_path = r'c:\Users\krish\OneDrive\Desktop\Karagir\temp\karagir editor.pdf'
out_path = r'c:\Users\krish\OneDrive\Desktop\Karagir\temp\karagir_editor.txt'
text = extract_text(pdf_path)
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('WROTE', out_path)
