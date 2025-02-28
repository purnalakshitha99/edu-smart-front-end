import NavBar from "../../components/layouts/NavBar";
import Hero from "../../assets/attemptQuiz/AtemptQuizHero.jpg";

function LandingPage() {
  return (
    <>
      <NavBar />
      <div className=" mt-4">
        <img
          className="h-96 w-full object-cover object-center"
          src={Hero}
          alt="nature image"
        />
        <div className=" text-quizHeader capitalize text-7xl px-10 mt-10">Exam Rules and Regulations </div>
      </div>
    </>
  );
}

export default LandingPage;
