import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner, Accordion, Card, useAccordionToggle, Badge} from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';


function AccordionToggle ({ children, eventKey }) {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <button className="question-accordion-btn"
      type="button"
      onClick={decoratedOnClick}
    >{children}</button>
  );
}

export default class App extends React.Component {

    state = {
      loading: true,
      questions: null,
      show: true,
    }



    async componentDidMount() {
      //main
      const url = "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&filter=!3ykawKpmTxzsYN-gX";
      //secondary
      const url2 = "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&filter=!LVBj29m4F4gXb6)0-yKKli";
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ questions: data.items, loading: false});
    }
    render(){
      
      if (this.state.loading){
        return <div className="text-center m1 mt-5"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>
      }

      if (!this.state.questions){
        return <div>No question loaded.</div>
      }

      return (
        <div className="App">
          <h1 className="m-3">Stack Exchange API</h1>
        <Accordion defaultActiveKey={this.state.questions.question_id}>
          {this.state.questions.map(question => (
            <Card key={question.question_id} className="question">

              <Card.Header>
                  <AccordionToggle eventKey={question.question_id} className="q-title ml-1 mb-1">{question.title}</AccordionToggle>
                  <div className="q-owner ml-1 mb-2"><img/>Submitted by: {question.owner.display_name}</div>
                  <div className="flex justify-content-between m-1">
                    <div className="tag-wrapper">
                        {question.tags.map(tag =>(
                        <Badge pill variant="dark" key={tag} className="tag">{tag}</Badge>
                      ))}
                    </div>
                    <div className="comment-count">Comments: {question.comment_count}</div>
                  </div>
              </Card.Header>
              <Accordion.Collapse eventKey={question.question_id}>
                <div>
                  <h5 className="ml-3 mt-3">Question</h5>
                  {question.body ? (
                    <div className="q-body">{ ReactHtmlParser(question.body)}</div>
                  ):(
                    <div className="q-body">Body Cannot be found.</div>
                  )}
                  
                  <h6 className="ml-3">Comments:</h6>
                  { question.comments ? (
                    question.comments.map(comment =>(
                      <div className="comment">
                        <div className="commentor">{comment.owner.display_name}</div>
                        <div className="comment-body">{ ReactHtmlParser(comment.body)}</div>
                      </div>
                    ))) : (
                      <div className="ml-3">No comments on this question.</div>
                    )
                  }
                </div>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
        </div>
      );
    }
}



