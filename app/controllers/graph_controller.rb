class GraphController < ApplicationController
  def index
  end

  def data
    respond_to do |format|
      format.json {
        render :json => [1,2,3,4,5]
          # {name: 'Amex', amount: '567.67'},
          # {name: 'Car', amount: '467.67'},
          # {name: 'Cell', amount: '133.67'},
          # {name: 'Utilities', amount: '57.67'},
          # {name: 'Netflix', amount: '7.99'}
        # ]
      }
    end
  end
end
