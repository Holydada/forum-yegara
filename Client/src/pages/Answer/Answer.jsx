// import React, { useState, useEffect } from "react";
// import classes from "../Answer/answer.module.css";
// import { IoMdContact } from "react-icons/io";
// import instance from "../../Api/axios";
// import { useParams } from "react-router-dom";
// import Loader from "../../Components/Loader/Loader";

// function Answer() {
//   const { questionId } = useParams();
//   const [answer, setAnswer] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [question, setQuestion] = useState({ title: "", description: "" });
//   const [answers, setAnswers] = useState([]);
//   const [isloading, setIsLoading] = useState(false);
//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
        
//         const response = await instance.get(`/question/${questionId}`, {
//           headers: {
//             authorization: "Bearer " + token,
//           },
//         }); // Passing the question_id "dynamically"
//         console.log(response.data);
//         setIsLoading(false);
//         setQuestion({
//           title: response.data.question.title,
//           description: response.data.question.description,
//         });
//       } catch (error) {
//         setIsLoading(false);
//         console.error("Error fetching question:", error);
//         setErrorMessage("Failed to load question.");
//       }
//     };

//     const fetchAnswers = async () => {
//       try {
//         const response = await instance.get(`answer/${questionId}`, {
//           headers: {
//             authorization: "Bearer " + token,
//           },
//         }); // Fetching answers based on question ID!
//         console.log(response.data);
//         setAnswers(response?.data?.answer);
//       } catch (error) {
//         console.error("Error fetching answers:", error);
//         setErrorMessage("Failed to load answers.");
//       }
//     };

//     // fetchUser();
//     fetchQuestion();
//     fetchAnswers(); // Fetching the answers
//   }, [questionId, token]);

//   const postAnswer = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     if (!answer) {
//       setIsLoading(false);
//       setErrorMessage("Please provide an answer.");
//       return;
//     }

//     try {
//       const response = await instance.post(
//         `/answer/${questionId}`,
//         {
//           answer,
//         },
//         {
//           headers: {
//             authorization: "Bearer " + token,
//           },
//         }
//       );
//       console.log(response.data);

//       if (response.status === 201) {
//         setSuccessMessage("Answer posted successfully");
//         setAnswer(""); // Here i'm Clearing the textarea after success
//         //here i am refetching the answers after posting a new one, so this  call right after posting a new answer.. i am tryinh to ensure the data is up-to-date.
    
//       } else if (response.status === 400) {
//         setErrorMessage("Please provide an answer.");
//       } else {
//         setErrorMessage("An unexpected error occurred.");
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error posting answer:", error);
//       setErrorMessage("Something went wrong. Try again later.");
//     }
//   };

//   return (
//     <>
//       {isloading ? (
//         <Loader />
//       ) : (
//         <main>
//           <section className={classes.question_section}>
//             <h2>Question</h2>
//             {/*Now here i am trying to Render fetched question title and description since it is dynamic */}
//             <h3>{question.title}</h3>
//             <p className={classes.link_work}>{question.description}</p>
//             <br />
//             <hr />
//           </section>

//           <section className={classes.answer_section}>
//             <h2>Answer From The Community</h2>
//             <hr />
//             {answers.length > 0 ? (
//               answers.map((answer, index) => (
//                 <div className={classes.answer} key={index}>
//                   <div>
//                     <IoMdContact size={80} />
//                     <h4 className={classes.username}>{answer.user_name}</h4>
//                   </div>

//                   <div className={classes.margin}>
//                     <p>{answer.answer}</p> {/* 👈👈Displaying each answer */}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No answers yet. Be the first to answer!😇</p>
//             )}
//             {/* Displaying The fetched username... */}
            
//           </section>

//           <section className={classes.answer_form}>
//             <h2>Answer The Top Question</h2>
//             {/* displaying error❌ or success messages👍 */}
//             {errorMessage && <p className={classes.error} style={{color:"red"}}>{errorMessage}</p>}
//             {successMessage && (
//               <p className={classes.success}>{successMessage}</p>
//             )}
//             <textarea
//               placeholder="Your Answer..."
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               required
//             />
//             <button
//               type="submit"
//               className={classes.submit_btn}
//               onClick={postAnswer}
//             >
//               Post Your Answer
//             </button>
//           </section>
//         </main>
//       )}
//     </>
//   );
// }

// export default Answer;




import React, { useState, useEffect } from "react";
import classes from "../Answer/answer.module.css";
import { IoMdContact } from "react-icons/io";
import instance from "../../Api/axios";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";

function Answer() {
  const { questionId } = useParams();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [question, setQuestion] = useState({ title: "", description: "" });
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`/question/${questionId}`, {
          headers: { authorization: "Bearer " + token },
        });
        setQuestion({
          title: response.data.question.title,
          description: response.data.question.description,
        });
      } catch (error) {
        console.error("Error fetching question:", error);
        setErrorMessage("Failed to load question.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnswers = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`answer/${questionId}`, {
          headers: { authorization: "Bearer " + token },
        });
        setAnswers(response.data.answer);
      } catch (error) {
        console.error("Error fetching answers:", error);
        setErrorMessage("Failed to load answers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
    fetchAnswers();
  }, [questionId, token]);

  const fetchAnswers = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get(`answer/${questionId}`, {
        headers: { authorization: "Bearer " + token },
      });
      setAnswers(response.data.answer);
    } catch (error) {
      console.error("Error fetching answers:", error);
      setErrorMessage("Failed to load answers.");
    } finally {
      setIsLoading(false);
    }
  };

  const postAnswer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!answer) {
      setIsLoading(false);
      setErrorMessage("Please provide an answer.");
      return;
    }

    try {
      const response = await instance.post(
        `/answer/${questionId}`,
        { answer },
        {
          headers: { authorization: "Bearer " + token },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Answer posted successfully");
        setAnswer(""); // Clear the textarea after success
        await fetchAnswers(); // Refetch answers after posting
      } else if (response.status === 400) {
        setErrorMessage("Please provide an answer.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      setErrorMessage("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <main>
          <section className={classes.question_section}>
            <h2>Question</h2>
            <h3>{question.title}</h3>
            <p className={classes.link_work}>{question.description}</p>
            <br />
            <hr />
          </section>

          <section className={classes.answer_section}>
            <h2>Answer From The Community</h2>
            <hr />
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <div className={classes.answer} key={index}>
                  <div>
                    <IoMdContact size={80} />
                    <h4 className={classes.username}>{answer.user_name}</h4>
                  </div>
                  <div className={classes.margin}>
                    <p>{answer.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No answers yet. Be the first to answer!😇</p>
            )}
          </section>

          <section className={classes.answer_form}>
            <h2>Answer The Top Question</h2>
            {errorMessage && <p className={classes.error} style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p className={classes.success}>{successMessage}</p>}
            <textarea
              placeholder="Your Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <button
              type="submit"
              className={classes.submit_btn}
              onClick={postAnswer}
            >
              Post Your Answer
            </button>
          </section>
        </main>
      )}
    </>
  );
}

export default Answer;