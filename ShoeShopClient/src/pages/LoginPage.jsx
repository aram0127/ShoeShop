import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/App.context";
import {
  LoginContainer,
  Title,
  LoginForm,
  InputGroup,
  Label,
  Input,
  LoginButton,
  ErrorMessage,
} from "./LoginPage.styled";

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 서버 API 호출
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { loginId, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        login(response.data.user);

        alert("로그인 성공");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("로그인 중 오류 발생");
        console.error(err);
      }
    }
  };

  return (
    <LoginContainer>
      <Title>로그인</Title>
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="loginId">아이디</Label>
          <Input
            id="loginId"
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginButton type="submit">로그인</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
