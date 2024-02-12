type Data = {
  id: number,
  title: string,
  time: string,
  description: string,
  week: number,
  icon: 'school' | 'work',
  buttonText?: 'Homework'
}

const data: Data[] = [
    {
      id: 1,
      title: "HTML",
      time: "12 hours",
      description:
        "Learn Semantic HTML5 syntax and create an HTML resume. Learn about web forms and create a contact form.",
      buttonText: "Homework",
      week: 1,
      icon: "work",
    },
    {
      id: 2,
      title: "Github & VS Code",
      time: "3 hours",
      description:
        "Create an account on Github to start backing up your code. Download VS Code and learn how to code locally with the power of an IDE.",
      week: 2,
      icon: "school",
    },
    {
      id: 3,
      title: "CSS",
      time: "12 hours",
      description:
        "Learn the power of CSS to style HTML to look however you want it. Structure your content into Media Objects, and learn modern page layout techniques.",
      buttonText: "Homework",
      week: 2,
      icon: "work",
    },
    {
      id: 4,
      title: "CSS Frameworks",
      time: "3 hours",
      description:
        "Learn how to leverage other CSS systems like Bootstrap to help you style your pages. Learn how to make your own CSS design system.",
      buttonText: "Homework",
      week: 3,
      icon: "work",
    },
    {
      id: 5,
      title: "Mobile Responsive Design",
      time: "6 hours",
      description:
        "Learn to use CSS to make your page responsive to device viewport sizes. We'll cover Media Queries, Mobile First Design and Adaptive layout techniques.",
      buttonText: "Homework",
      week: 4,
      icon: "school",
    },
    {
      id: 6,
      title: "Accessibility",
      time: "1.5 hours",
      description:
        "Accessibility helps those with visual impairments enjoy the web, but its more than that. Learn how and why making your HTML accessibile is important to all users.",
      buttonText: "Homework",
      week: 5,
      icon: "school",
    },
    {
      id: 7,
      title: "UI & UX",
      time: "1.5hours",
      description:
        "Learn what makes a good user interface and what makes a good user experience, and the differences between those two topics.",
      week: 6,
      icon: "school",
    },
    {
      id: 8,
      title: "Portfolio Project",
      time: "3 hours",
      description:
        "We'll start building our own Portfolio Site and host it live on our Github account.",
      week: 7,
      icon: "school",
    },
    {
      id: 9,
      title: "Web Browsers",
      time: "3 hours",
      description:
        "Learn about the differences between browsers, rendering engines, and tools for cross browser compatibility.",
      week: 6,
      icon: "school",
    },
    {
      id: 10,
      title: "The DOM",
      time: "6 hours",
      description:
        "Learn about the Document Object Model and its relation to the HTML you write. We'll also learn a select few pieces of the DOM API and some basic Javascript to add some interactivity to our pages.",
      week: 8,
      icon: "school",
    },
    {
      id: 11,
      title: "Career Skills",
      time: "9 hours",
      description:
        "We'll cover resume writing skills and job board resources and tips when applying and talking to recruiters. We'll also practice with a mock interview.",
      week: 9,
      icon: "school",
    },
]
  
  export default data