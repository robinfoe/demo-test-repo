package io.fabric8.quickstarts.camel;
import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;

public class MyAggregationStrategy implements AggregationStrategy {
	@Override
	public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
	        if (oldExchange == null) {
	            return newExchange;
	        } else {
	            String body1 = oldExchange.getIn().getBody(String.class);
	            String body2 = newExchange.getIn().getBody(String.class);
	            String merged = (body1 == null) ? body2 : "["+body1 + "," + body2+"]";
	            oldExchange.getIn().setBody(merged);
	            return oldExchange;
	        }
        	}

}