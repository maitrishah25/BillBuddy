Rails.application.routes.draw do

  get '/graph' => 'graph#index'
  get '/graph/data', :defaults => { :format => 'json' }

  namespace :api do
    resources :bills, except: [:new]
  end

  get '/' => 'users#new', as: :new

  get '/users/profile' => 'users#profile', as: :profile
  get '/users/log_in' => 'users#log_in', as: :log_in

  post '/sessions' => 'sessions#create'
  delete '/sessions' => 'sessions#destroy'

  resources :users, only: [:new, :create]


end
