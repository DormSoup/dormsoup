import styles from "./page.module.css";

const DormSoupName = () => (
  <>
    <span className="font-bold">Dorm</span>
    <span className="">Soup</span>
  </>
);

export default function About() {
  return (
    <main className="flex flex-col items-center">
      <div
        className={`${styles.aboutDiv} mx-auto mt-8 max-w-3xl space-y-2 rounded-xl bg-white p-6 shadow-2xl`}
      >
        <h1>Introduction</h1>
        <p>
          Welcome to <DormSoupName />, a campus-wide event catalog platform backed by large language
          models! <DormSoupName /> extracts events from dormspams, tags them, and display them
          cleanly in a uniform format, thus saving everyone&apos;s trouble of going through hundreds
          of emails to search for interesting events.
        </p>
        <p>
          DormSoup is maintained by SIPB, the
          <a href="https://sipb.mit.edu" target="_blank">
            {" "}
            Student Information Processing Board
          </a>
          .
        </p>
        <h1>Data Privacy</h1>
        <h2>What data does DormSoup collect from me?</h2>
        <p>
          <DormSoupName /> uses MIT&apos;s Touchstone authentication system and gets your name and
          email from there. That&apos;s it. We use these data to first ensure that only MIT students
          may view the events. We also store these metadata in our database so that we can send you
          notifications if you subscribe and keep track of the events you like. Finally,{" "}
          <DormSoupName /> compares your email against the sender of a dormspam to determine if you
          can edit that event manually.
        </p>
        <h2>Will DormSoup be able to see my inbox?</h2>
        <p>
          Absolutely not. <DormSoupName />
          &apos;s backend scrapes emails from one particular inbox owned by the <DormSoupName />{" "}
          developers. Specifically, it is a locker in the MIT Athena File System (AFS).
        </p>
        <p>
          If you don&apos;t trust us, at least you should trust Microsoft and their IT security. If
          you didn&apos;t explicitly authorize <DormSoupName /> to access your inbox (which it
          won&apos;t ask in the first place), we won&apos;t be able to see it.
        </p>
        <h2>Will OpenAI be able to see our dormspams?</h2>
        <p>
          No. <DormSoupName /> is no longer dependent on any OpenAI APIs. It uses{" "}
          <a href="https://llms.mit.edu/">SIPB LLMs</a> for all of its AI needs. Also, while OpenAI
          does use input from ChatGPT to train their models, and <DormSoupName /> previously used
          GPT-3.5 and GPT-4 to parse dormspams.{" "}
          <a href="https://openai.com/enterprise-privacy">
            OpenAI promises not to use or retain data sent through business API endpoints.
          </a>
        </p>
        <h1>Contributing and Feedback</h1>
        <p>
          <DormSoupName /> is an open source project hosted on Github. We welcome contributions and
          feedbacks. <a href="https://github.com/Dormsoup/dormsoup">Frontend code repo</a>,{" "}
          <a href="https://github.com/Dormsoup/dormsoup-daemon">
            Backend code repo (with all the prompts!)
          </a>
        </p>
        <p>
          If you have any questions, comments, or suggestions, feel free to open an issue at the
          appropriate repo or email us at{" "}
          <a href="mailto:sipb-dormdigest@mit.edu">sipb-dormdigest@mit.edu</a>.
        </p>
        <p className="text-xs">
          (Please please please don&apos;t blame the code quality. Much of the early development was
          done under intensive pair programming with adhoc design decisions made all over the place.
          Apparently much can be done to improve the code quality. If you like to refactor the code,
          feel free to open an PR!:)
        </p>
        <h1>Acknowledgement</h1>
        <p>
          We want to thank <a href="https://dormdigest.xvm.mit.edu/">the SIPB DormDigest team</a>{" "}
          for early feedbacks. They offered a similar product but adopted a very different approach.
          Now we&apos;ve combined our strengths to create a single, improved product that can reach
          even more users.
        </p>
        <p>We would also like to thank the generous support from IST staffs.</p>
        <p>Finally, great thanks to all the friends who participated in early beta testing!</p>
      </div>
    </main>
  );
}
