import { motion } from 'framer-motion';
import { premiumEase } from '~/lib/framer-utils';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const item = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: direction === 'top' ? -20 : 20,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: premiumEase,
      }
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={`blur-text ${className} flex flex-wrap`}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          variants={item}
          style={{
            display: 'inline-block',
            willChange: 'transform, filter, opacity',
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default BlurText;
