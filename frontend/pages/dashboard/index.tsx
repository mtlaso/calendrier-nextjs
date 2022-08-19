import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

type TypeData = {
  data: string;
};

export default function Dashboard({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>data : {data}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = context.req.cookies["session-cookie"];

  // Si la session n'existe pas, redirection vers la page de connexion
  if (data === undefined) {
    const redirectMessage = encodeURIComponent("Please login to access dashboard");
    return {
      redirect: {
        permanent: false,
        destination: `/auth/login?message=${redirectMessage}`,
      },
    };
  }

  return {
    props: {
      data: data,
    },
  };
};
