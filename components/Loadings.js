import styled from "styled-components";

const LoadingWrapper = styled.div`
  margin: 30px 0;

  p {
    background: #2b56dc;
    color: white;
    border-radius: 5px;
    display: inline-block;
    padding: 2px 16px;
  }
`;

const Loading = ({ step }) => {
  return (
    <LoadingWrapper>
      <img src="/static/images/white-loading.svg" width={40} />
      {!!step && (
        <div className="mt-3">
          <p>{step}</p>
        </div>
      )}
    </LoadingWrapper>
  );
};

export default Loading;
