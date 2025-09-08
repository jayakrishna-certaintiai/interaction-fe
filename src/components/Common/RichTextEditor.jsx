import React, { useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const RichTextEditor = ({ content }) => {
  // Convert markdown to HTML
  const markdownToHtml = (markdown) => {
    return marked(markdown, { breaks: true, gfm: true });
  };

  // Sanitize the HTML
  const sanitizedHtml = DOMPurify.sanitize(markdownToHtml(content));

  return (
    <div
      className="emailContent"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default RichTextEditor;
