import clsx from 'clsx';
import PropTypes from 'prop-types';

const titleClassNames = {
  note: 'text-[#4C97FF]',
  important: 'text-[#FFBB33]',
  tip: 'text-primary-2',
  warning: 'text-secondary-1',
  info: 'text-gray-5',
  comingSoon: 'text-secondary-5',
};

const borderClassNames = {
  note: 'border-[#4C97FF]',
  important: 'border-[#FFBB33]',
  tip: 'border-primary-2',
  warning: 'border-secondary-1',
  info: 'border-gray-new-70',
  comingSoon: 'border-secondary-5',
};

const Admonition = ({ children = null, type = 'note', title = null, asHTML = false }) => {
  const lowerCaseType = type.charAt(0).toLowerCase() + type.slice(1);
  const currentType = type === 'comingSoon' ? 'Coming soon' : type;
  const currentTitle = title || currentType;
  return (
    <div
      className={clsx(
        'admonition not-prose mt-5 flex flex-col rounded-[1px] border-l-4 bg-gray-new-98 px-5 py-4 leading-normal dark:bg-gray-new-10 [&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm',
        borderClassNames[lowerCaseType]
      )}
    >
      <h4 className={clsx('text-xs font-bold uppercase', titleClassNames[lowerCaseType])}>
        {currentTitle}
      </h4>
      {asHTML ? (
        <div
          className="admonition-text mt-1.5 text-base"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      ) : (
        <div className="admonition-text mt-1.5 text-base">{children}</div>
      )}
    </div>
  );
};

Admonition.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(titleClassNames)),
  title: PropTypes.string,
  asHTML: PropTypes.bool,
};

export default Admonition;
