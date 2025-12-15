import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  min-height: 60vh;
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: bold;
  color: #212a2f;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: bold;
  color: #212a2f;
`;

export const Input = styled.input`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #212a2f;
  }
`;

export const LoginButton = styled.button`
  padding: 15px;
  background-color: #212a2f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const ErrorMessage = styled.p`
  color: #d9534f;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
`;
