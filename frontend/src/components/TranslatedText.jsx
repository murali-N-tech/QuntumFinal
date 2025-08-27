import React from 'react';
import useAutoTranslate from '../hooks/useAutoTranslate';

/**
 * A reusable component that takes English text as children and
 * automatically translates it using the useAutoTranslate hook.
 *
 * @param {object} props
 * @param {string} props.children - The English text to be translated.
 * @param {string} [props.as='span'] - The HTML tag to render the text in (e.g., 'p', 'h1').
 * @param {string} [props.className=''] - CSS classes to apply to the component.
 */
const TranslatedText = ({ children, as: Component = 'span', ...props }) => {
  const { translatedText, isTranslating } = useAutoTranslate(children);

  // While translating, we can show the original text to prevent layout shifts.
  // Or, you could return a loading skeleton here.
  return <Component {...props}>{translatedText}</Component>;
};

export default TranslatedText;