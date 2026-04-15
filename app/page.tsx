"use client";

import { useEffect, useState } from "react";
import fs from 'fs';
import path from 'path';

// Read article data at build time for server component
// But for client component, we'll fetch it

export default function Home() {
  const [bodyContent, setBodyContent] = useState("");

  useEffect(() => {
    // Load the body content
    const loadContent = async () => {
      try {
        const [bodyHtml, articleJs] = await Promise.all([
          fetch('/superdesign-body.html').then(res => res.text()),
          fetch('/article-data.js').then(res => res.text())
        ]);

        setBodyContent(bodyHtml);

        // Inject article data as a global variable immediately
        const script = document.createElement('script');
        script.id = 'article-data-script';
        script.textContent = articleJs;
        document.head.appendChild(script);

        // Add original Superdesign JavaScript functionality
        const functionScript = document.createElement('script');
        functionScript.innerHTML = `
          // Contact overlay functions
          function openContact() {
            const overlay = document.getElementById('contact-overlay');
            if (overlay) {
              overlay.classList.remove('translate-y-full');
              document.body.style.overflow = 'hidden';
            }
          }

          function closeContact() {
            const overlay = document.getElementById('contact-overlay');
            if (overlay) {
              overlay.classList.add('translate-y-full');
              document.body.style.overflow = '';
            }
          }

          // Article modal functions
          function openArticle(articleId) {
            const modal = document.getElementById('article-modal');
            const modalContent = document.getElementById('article-modal-content');
            const modalTitle = document.getElementById('modal-title-persistent');

            if (modal && typeof articleData !== 'undefined') {
              const article = articleData[articleId];
              if (article) {
                // Update modal title
                if (modalTitle) {
                  modalTitle.textContent = article.title || 'Article';
                }

                // Update modal content
                if (modalContent) {
                  modalContent.innerHTML = article.content || '<p>Content not available</p>';
                  // Scroll modal content to top
                  modalContent.scrollTop = 0;
                }

                modal.classList.remove('translate-y-full');
                document.body.classList.add('article-modal-active');
                // Ensure modal starts at top of viewport
                modal.style.top = '0';
              }
            }
          }

          function closeArticle() {
            const modal = document.getElementById('article-modal');
            if (modal) {
              modal.classList.add('translate-y-full');
              document.body.classList.remove('article-modal-active');
            }
          }

          // Floating nav and contact button visibility
          window.addEventListener('scroll', () => {
            const floatingNav = document.getElementById('floating-nav');
            const contactBtn = document.getElementById('floating-contact-btn');

            if (window.scrollY > 500) {
              if (floatingNav) {
                floatingNav.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
              }
              if (contactBtn) {
                contactBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
              }
            } else {
              if (floatingNav) {
                floatingNav.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
              }
              if (contactBtn) {
                contactBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
              }
            }
          });

          // Accordion functionality
          document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.accordion-trigger');
            if (trigger) {
              const content = trigger.nextElementSibling;
              const icon = trigger.querySelector('iconify-icon');

              if (content && content.classList.contains('accordion-content')) {
                const isOpen = !content.classList.contains('max-h-0');

                // Close all other accordions
                document.querySelectorAll('.accordion-content').forEach(acc => {
                  acc.classList.add('max-h-0', 'opacity-0');
                  acc.classList.remove('max-h-screen', 'opacity-100');
                });
                document.querySelectorAll('.accordion-trigger iconify-icon').forEach(i => {
                  i.style.transform = 'rotate(0deg)';
                });

                // Toggle current accordion
                if (!isOpen) {
                  content.classList.remove('max-h-0', 'opacity-0');
                  content.classList.add('max-h-screen', 'opacity-100');
                  if (icon) icon.style.transform = 'rotate(180deg)';
                }
              }
            }
          });

          // Smooth scroll for anchor links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
              const href = this.getAttribute('href');
              if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
          });

          // Make functions globally available
          window.openContact = openContact;
          window.closeContact = closeContact;
          window.openArticle = openArticle;
          window.closeArticle = closeArticle;

          console.log('Xecuit: Scripts loaded, articleData keys:', typeof articleData !== 'undefined' ? Object.keys(articleData) : 'undefined');
        `;
        document.head.appendChild(functionScript);

      } catch (err) {
        console.error('Error loading content:', err);
      }
    };

    loadContent();

    return () => {
      // Cleanup
      const existingScript = document.getElementById('article-data-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      {/* Iconify icon library */}
      <script
        src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
      />
      {/* Original Superdesign body content */}
      <div
        dangerouslySetInnerHTML={{ __html: bodyContent }}
        className="min-h-screen"
      />
    </>
  );
}
