const Footer = () => {
  return (
    <div className="text-center my-3 text-sm text-gray-500 dark:text-gray-400">
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold text-gray-700 dark:text-white">
        Expenzoir
      </span>
      . All rights reserved.
    </div>
  );
};

export default Footer;