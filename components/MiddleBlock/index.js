import React from "react";
import { Row, Col } from "antd";
import { Fade } from "react-reveal";

import Button from "../common/Button";

import * as S from "./styles";

const MiddleBlock = ({ last, id, title, content, button, icon }) => {
  return (
    <S.MiddleBlock last={last} id={id}>
      <Row type="flex" justify="center" align="middle">
        <Fade bottom>
          <S.ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <S.Title>{title}</S.Title>
              <S.Content last={last}>{content}</S.Content>
              {button ? (
                <Button name="submit" type="submit">
                  {button}
                </Button>
              ) : (
                ""
              )}
              { icon ?
                <div className='figures'>
                  <img className='figure' src="/img/html_js_css_logo.png" alt="html, js, css logos"/>
                  <img className='figure' src="/img/react_icon.png" alt="react logo"/>
                </div>
                : null
              }
            </Col>
          </S.ContentWrapper>
        </Fade>
      </Row>
    </S.MiddleBlock>
  );
};

export default MiddleBlock;
