class Api::BillsController < ApplicationController

 #  api_bills GET    /api/bills(.:format)     api/bills#index
 def index
   user = User.find_by({token: env['HTTP_TOKEN']})
   render json: user.bills
 end

 #          POST   /api/bills(.:format)     api/bills#create
 def create
   user = User.find_by({token: env['HTTP_TOKEN']})
   bill = user.bills.create(bill_params)
   render json: bill
 end

 # api_bill GET    /api/bills/:id(.:format) api/bills#show
 def show
   user = User.find_by({token: env['HTTP_TOKEN']})
   render json: user.bills.find(params[:id])
 end
 #          PATCH  /api/bills/:id(.:format) api/bills#update
 #          PUT    /api/bills/:id(.:format) api/bills#update
 def update
   user = User.find_by({token: env['HTTP_TOKEN']})
   bill = user.bills.find(params[:id])
   bill.update(bill_params)
   render json: bill
 end
 #          DELETE /api/bills/:id(.:format) api/bills#destroy
 def destroy
   user = User.find_by({token: env['HTTP_TOKEN']})
   user.bills.destroy(params[:id])
   render json: {status: 202, message: 'Delete successful'}
 end

 private

 def bill_params
   params.require(:bill).permit(:name, :due_date, :amount, :paid_status)
 end

end
