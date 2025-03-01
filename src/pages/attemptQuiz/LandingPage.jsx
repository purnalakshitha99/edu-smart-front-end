import NavBar from "../../components/layouts/NavBar";
import Hero from "../../assets/attemptQuiz/AtemptQuizHero.jpg";
import { Checkbox, Typography } from "@material-tailwind/react";
import { Radio } from "@material-tailwind/react";
import Footer from "../../components/layouts/Footer";

function LandingPage() {
  return (
    <>
      <NavBar />
      <div className="">
        <img
          className="h-96 w-full object-cover object-center"
          src={Hero}
          alt="nature image"
        />
        <div className="  h-screen m-auto w-[1200px]">
          <div className="text-quizHeader p-10 flex items-center justify-center capitalize text-7xl">
            Exam Rules and Regulations
          </div>{" "}
          <div className=" text-xl p-5 w-[800px] m-auto space-y-4">
            <li>Duration of the test will be 15 minutes only.</li>
            <li>Answer all the questions, don't leave out any.</li>
            <li>
              In this Test, you will get 8 questions in all that is 1 Mark
              Questions of 6 and 2 Marks questions of 2 for total of 10 marks.
            </li>
            <li>There are no partial marks and no negative marks.</li>
            <li>Accept the terms & condition</li>
            <div className="py-10 flex items-center gap-2 capitalize">
              <Checkbox
              // label={
              //   <Typography color="blue-gray" className="flex font-medium">
              //     I agree with the
              //     <Typography
              //       as="a"
              //       href="#"
              //       color="blue"
              //       className="font-medium transition-colors hover:text-blue-700"
              //     >
              //       &nbsp;terms and conditions
              //     </Typography>
              //     .
              //   </Typography>
              // }
              />
              <p className=" font-medium">I agree with the</p>
              <p className=" text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                &nbsp;terms and conditions
              </p>
            </div>
            <div className=" flex justify-center">
              <button className="bg-[#49BBBD] hover:bg-[#62999A] text-white font-semibold py-2 px-6  rounded">
                Attempt Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
