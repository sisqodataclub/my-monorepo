# pdf_converter/services.py
import io
import pdfkit
from django.template import Template, Context
from django.template.loader import render_to_string
from django.conf import settings
import PyPDF2
import os

class PDFService:
    """Core PDF generation engine using pdfkit (wkhtmltopdf)."""

    @staticmethod
    def render_html_to_pdf(html_source, context=None, css_string=None, options=None):
        """
        Convert HTML + CSS + Context data into a PDF using pdfkit.

        Args:
            html_source (str): Raw HTML or template path (e.g., 'pdf/invoice.html').
            context (dict): Data to inject into the HTML.
            css_string (str): Optional custom CSS (injected into <style> tag).
            options (dict): Additional pdfkit options (e.g., page size, margin).

        Returns:
            bytes: The generated PDF file as bytes.
        """
        context = context or {}

        # 1. Render the HTML
        if isinstance(html_source, str) and html_source.endswith('.html'):
            rendered_html = render_to_string(html_source, context)
        else:
            template = Template(html_source)
            rendered_html = template.render(Context(context))

        # 2. Inject custom CSS if provided
        if css_string:
            # Insert CSS into the head
            style_tag = f"<style>{css_string}</style>"
            if '<head>' in rendered_html:
                rendered_html = rendered_html.replace('<head>', f'<head>{style_tag}')
            else:
                rendered_html = f'<html><head>{style_tag}</head><body>{rendered_html}</body></html>'

        # 3. Prepare pdfkit options
        wkhtmltopdf_options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'enable-local-file-access': None,  # Allows loading local images/CSS
        }
        if options:
            wkhtmltopdf_options.update(options)

        # 4. Generate PDF using pdfkit
        # If wkhtmltopdf is not in PATH, specify the path explicitly:
        config = pdfkit.configuration(wkhtmltopdf=settings.WKHTMLTOPDF_PATH) if hasattr(settings, 'WKHTMLTOPDF_PATH') else None
        pdf_bytes = pdfkit.from_string(rendered_html, False, options=wkhtmltopdf_options, configuration=config)
        return pdf_bytes

    @staticmethod
    def generate_from_template(template_obj, context, options=None):
        """
        Generate a PDF using a stored PDFTemplate model instance.
        """
        html_content = template_obj.html_content
        css_content = template_obj.css_content
        return PDFService.render_html_to_pdf(html_content, context, css_content, options)

    @staticmethod
    def merge_pdfs(pdf_bytes_list):
        """
        Merge multiple PDF byte streams into a single PDF file.
        """
        if len(pdf_bytes_list) == 1:
            return pdf_bytes_list[0]

        merger = PyPDF2.PdfMerger()
        for pdf_bytes in pdf_bytes_list:
            merger.append(io.BytesIO(pdf_bytes))

        output = io.BytesIO()
        merger.write(output)
        output.seek(0)
        return output.getvalue()
