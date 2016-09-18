require 'rubygems'
require 'sinatra'
#require 'sequel'

get '/' do
	redirect to('/index.html')
end

post '/room.html' do
	nameR = params[:Name]
	roomR = params[:Room]
	redirect to('/room.html')
end

get '/room.html' do
	send_file('/room.html')
end