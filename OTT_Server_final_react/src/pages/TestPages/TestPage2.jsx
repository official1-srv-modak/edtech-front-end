import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Pages.css";
import Navbar from '../../components/Navbar/Navbar';
import Dialog from '../../components/MessageComponent/Dialog';

function Page2() {
    const { testTitle } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timer, setTimer] = useState(state?.duration || 0);
    const [answers, setAnswers] = useState({});
    const [tabSwitchCount, setTabSwitchCount] = useState(0); // Track tab switches
    const malpracticeLog = []; // To record the URLs and events

    const [dialog, setDialog] = useState(null); // State for dialog

    const showDialog = (message, buttonText = "OK") => {
        setDialog({ message, buttonText });
    };

    const handleCloseDialog = () => {
        setDialog(null);
    };


    const getTestQuestionsUrl = import.meta.env.VITE_GET_TEST_QUESTIONS;
    const getRecordTestUrl = import.meta.env.VITE_RECORD_TEST;


    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            event.stopPropagation();
            // alert("Back navigation is disabled during the test.");
            // window.history.pushState(null, window.location.href);
        };

        // Push a dummy state to the history stack
        window.history.pushState(null, null, null, null, null, null, null, window.location.href);

        // Add event listener for back navigation
        window.addEventListener("popstate", handleBackButton);

        return () => {
            // Remove event listener on cleanup
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);


    useEffect(() => {
        localStorage.setItem("answers", null);
        fetch(`${getTestQuestionsUrl}${testTitle}`)
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });
    }, [testTitle]);

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (timer === 0) {
            handleFinish();
        }
    }, [timer]);

    useEffect(() => {

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                const visitedUrl = document.referrer || "Unknown URL";
                malpracticeLog.push({ event: "Tab switch", url: visitedUrl, timestamp: new Date().toISOString() });
                console.log("Tab switch detected:", visitedUrl);
            }
        };

        const handleWindowBlur = () => {
            malpracticeLog.push({ event: "Left browser window", url: "Desktop environment", timestamp: new Date().toISOString() });
            console.log("User left the browser window");
            setTabSwitchCount((prev) => prev + 1);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            // document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, []);


    useEffect(() => {
        if (tabSwitchCount === 1) {
            showDialog("Warning: Do not switch tabs or windows during the exam.", "Sorry");
        } else if (tabSwitchCount > 1) {
            // Define title and message inside the useEffect scope
            const title = "Malpractice Detected";
            const message = "Exam stopped due to malpractices. You have been awarded 0.";

            // Call API to record the test result with 0 marks
            fetch(getRecordTestUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "test_user",
                    marks: 0,
                }),
            }).then(() => navigate("/end-test", {
                state: { title, message } // Pass state correctly
            }));
        }
    }, [tabSwitchCount, getRecordTestUrl, navigate]);


    const handleAnswerSelection = (answer) => {
        setSelectedAnswer(answer);
        const updatedAnswers = { ...answers, [currentQuestionIndex]: answer };
        setAnswers(updatedAnswers);
        localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    };

    const handleNext = () => {
        if (selectedAnswer) {
            if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
                setScore(score + 1);
            }
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
    };

    const handleFinish = () => {
        if (selectedAnswer) {
            const updatedAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
            setAnswers(updatedAnswers);
            localStorage.setItem('answers', JSON.stringify(updatedAnswers));
        }

        if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
            setScore(score + 1);
        }

        // alert(`Test finished! Your score is ${score} / ${questions.length}`);
        // showDialog(`Test finished! Your score is ${score} / ${questions.length}`, "Ok");
        const title = "Test Finished";
        const message = `Test finished! Your score is ${score} / ${questions.length}`;

        fetch(getRecordTestUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "test_user",
                marks: score,
            }),
        }).then(() => navigate("/end-test", {
            state: { title, message } // Pass state correctly
        }));
    };

    useEffect(() => {
        const savedAnswers = JSON.parse(localStorage.getItem('answers'));
        if (savedAnswers) {
            setAnswers(savedAnswers);
        }
    }, []);

    useEffect(() => {
        setSelectedAnswer(answers[currentQuestionIndex] || null);
    }, [currentQuestionIndex, answers]);

    if (!questions.length) {
        return <div>Loading questions for {testTitle}...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="test-page">
            <Navbar flag={1} />
            <h2>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</h2><br />

            <h1>{testTitle}</h1><br /><br /><br />
            <h2>{currentQuestion.question}</h2>
            <div className="test-options">
                {["option1", "option2", "option3", "option4"].map((option, index) => (
                    <button
                        key={index}
                        className={`test-option ${selectedAnswer === currentQuestion[option] ? "selected" : ""}`}
                        onClick={() => handleAnswerSelection(currentQuestion[option])}
                    >
                        {currentQuestion[option]}
                    </button>
                ))}
            </div>
            <div className="test-navigation">
                {currentQuestionIndex > 0 && (
                    <button onClick={handlePrevious} className="next-btn">
                        Previous
                    </button>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                    <button onClick={handleNext} className="next-btn">
                        Next
                    </button>
                ) : (
                    <button onClick={handleFinish} className="finish-btn">
                        Finish
                    </button>
                )}
            </div>
            {dialog && (
                <Dialog
                    message={dialog.message}
                    buttonText={dialog.buttonText}
                    onClose={handleCloseDialog}
                />
            )}
        </div>
    );
}

export default Page2;
