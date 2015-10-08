class SessionsController < ApplicationController

  # sessions POST   /sessions(.:format)      sessions#create
  def create
    username = params[:username]
    password = params[:password]
    user = User.find_by({username: username})
    if user && user.authenticate(password)
      session[:user_id] = user.id
      redirect_to profile_path
    else
      redirect_to log_in_path
    end
  end

  #  session DELETE /sessions/:id(.:format)  sessions#destroy
  def destroy
    session[:user_id] = nil
    redirect_to new_path
  end


end
