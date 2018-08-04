Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  post "/api/artobjects", to: "art_objects#create"
  get "/api/artobjects", to: "art_objects#index"
  put "/api/artobjects/:id", to: "art_objects#update"

end
