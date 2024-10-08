const BottomBar = () => {
  return (
    <div>
      <div className="absolute bottom-0 mx-auto mt-4 w-full border-t-2 border-gray-300 bg-white py-4 text-center text-gray-800">
        Made with ❤️ by the SIPB DormSoup Project.
        <br className="block md:hidden" />
        <a href="/about" className="ml-4 underline">
          About
        </a>
        <a href="mailto:dormsoup@mit.edu" className="ml-4 underline">
          Contact&nbsp;Us
        </a>
        <a href="https://accessibility.mit.edu/" className="ml-4 underline">
          Accessibility
        </a>
      </div>
    </div>
  );
};

export default BottomBar;
