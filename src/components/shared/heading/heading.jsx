import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const styles = {
  size: {
    '2xl': 't-8xl font-bold leading-dense',
    xl: 't-7xl font-bold leading-dense',
    lg: 'text-[72px] font-bold leading-tight 2xl:text-6xl xl:text-[56px] xl:leading-dense md:text-[44px]',
    md: 't-6xl font-bold leading-dense',
    '2sm':
      'text-[56px] font-medium leading-none tracking-tighter 2xl:text-[44px] xl:text-4xl lg:text-[36px] lg:leading-tight',
    sm: 't-4xl font-semibold',
    xs: 't-base font-bold tracking-wider uppercase',
  },
  theme: {
    white: 'text-white',
    black: 'text-black dark:text-white',
  },
};

const HeadingBadge = ({ text }) => (
  <span className="nowrap mb-2 inline-block rounded-full bg-primary-4 px-[14px] py-[7px] text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-primary-1">
    {text}
  </span>
);

const Heading = forwardRef(
  (
    {
      className: additionalClassName = null,
      tag: Tag,
      size = null,
      theme = null,
      badge = '',
      asHTML = false,
      children,
      ...otherProps
    },
    ref
  ) => {
    const className = clsx(styles.size[size], styles.theme[theme], additionalClassName);

    if (asHTML) {
      return badge ? (
        <>
          <HeadingBadge text={badge} />
          <Tag
            className={className}
            dangerouslySetInnerHTML={{ __html: children }}
            ref={ref}
            {...otherProps}
          />
        </>
      ) : (
        <Tag
          className={className}
          dangerouslySetInnerHTML={{ __html: children }}
          ref={ref}
          {...otherProps}
        />
      );
    }

    return badge ? (
      <>
        <HeadingBadge text={badge} />
        <Tag className={className} ref={ref} {...otherProps}>
          {children}
        </Tag>
      </>
    ) : (
      <Tag className={className} ref={ref} {...otherProps}>
        {children}
      </Tag>
    );
  }
);

HeadingBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

Heading.propTypes = {
  className: PropTypes.string,
  badge: PropTypes.string,
  tag: PropTypes.string.isRequired,
  size: PropTypes.oneOf(Object.keys(styles.size)),
  theme: PropTypes.oneOf(Object.keys(styles.theme)),
  asHTML: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Heading;
